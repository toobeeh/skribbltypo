// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
class PatchReplacement{
  listItem: Element;
  sourceRegex: RegExp;
  targetRegex: RegExp;

  constructor(source: string, target: string){
    this.sourceRegex = new RegExp(source,"g");
    this.targetRegex = new RegExp(target,"g");
  }
}

class PatchInjection{
  listItem: Element;
  injectionCode: string;
  injectionPositionRegex: RegExp;

  constructor(code: string, position: string){
    this.injectionCode = code.trim();
    this.injectionPositionRegex = new RegExp(position,"g");
  }
}

class PatchInjectionResult {
  matches: {original: string, result: string}[];
  recursionAbort: boolean;
  injection: PatchInjection;
  constructor(injection: PatchInjection, matches: {original: string, result: string}[], recursionAbort: boolean){
    this.injection = injection;
    this.recursionAbort = recursionAbort;
    this.matches = matches;
  }
}

class PatchReplacementResult {
  matches: {original: string, result: string}[];
  recursionAbort: boolean;
  replacement: PatchReplacement;
  constructor(replacement: PatchReplacement, matches: {original: string, result: string}[], recursionAbort: boolean){
    this.replacement = replacement;
    this.recursionAbort = recursionAbort;
    this.matches = matches;
  }
}

class CodePatcherResult{
  successfulInjections: PatchInjectionResult[];
  successfulReplacements: PatchReplacementResult[];
  failedInjections: PatchInjectionResult[];
  failedReplacements: PatchReplacementResult[];
  sourceCode: string;
  patchedCode: string;
  successrate: number;

  constructor(successfulInjections: PatchInjectionResult[], successfulReplacements: PatchReplacementResult[], failedInjections: PatchInjectionResult[], failedReplacements: PatchReplacementResult[], sourceCode: string, patchedCode: string){
    this.successfulInjections = successfulInjections;
    this.successfulReplacements = successfulReplacements;
    this.failedInjections = failedInjections;
    this.failedReplacements = failedReplacements;
    this.sourceCode = sourceCode;
    this.patchedCode = patchedCode;
    this.successrate = (successfulReplacements.length + successfulInjections.length) + 100 / (successfulReplacements.length + successfulInjections.length + failedReplacements.length + failedReplacements.length);
  }
}

class CodePatcher{
  debug: boolean;
  injections: PatchInjection[];
  replacements: PatchReplacement[];
  lastResult: CodePatcherResult = null;

  constructor(injections: PatchInjection[], replacements: PatchReplacement[], debug = true){
    this.replacements = replacements;
    this.injections = injections;
    this.debug = debug;
  }

  process(sourceCode: string){
    let patch = sourceCode;
    const successfulInjections: PatchInjectionResult[] = [];
    const successfulReplacements: PatchReplacementResult[] = [];
    const failedInjections: PatchInjectionResult[] = [];
    const failedReplacements: PatchReplacementResult[] = [];

    for (const injection of this.injections) {
      const originalOccurences = [...sourceCode.matchAll(injection.injectionPositionRegex)].length;
      const matches = new Array<{original: string, result: string}>();
      let recursionAbort = false;
      let match;

      while((match = injection.injectionPositionRegex.exec(patch)) != null && !recursionAbort){
        matches.push({original: match[0], result:""});
        const beforeInsert = patch.slice(0,match.index + match[1].length);
        const afterInsert = patch.slice(match.index + match[1].length);
        patch = beforeInsert + "\n" + injection.injectionCode + afterInsert;
        if(matches.length > 10 * originalOccurences) recursionAbort = true;
      }

      const result = new PatchInjectionResult(injection, matches, recursionAbort);
      if(matches.length > 0) successfulInjections.push(result);
      else failedInjections.push(result);
    }

    for (const replacement of this.replacements) {
      const matches = new Array<{original: string, result: string}>();
      const target = replacement.targetRegex.exec(patch);
      if(target != null){
        patch = patch.replaceAll(replacement.sourceRegex, match => {
          matches.push({original: match, result: target[1]});
          return target[1];
        });
      }
      const result = new PatchReplacementResult(replacement, matches, false);
      if(matches.length > 0) successfulReplacements.push(result);
      else {
        failedReplacements.push(result);
      };
    }

    const result = new CodePatcherResult(
      successfulInjections,
      successfulReplacements,
      failedInjections,
      failedReplacements,
      sourceCode,
      patch
    );
    return result;
  }
}

class PatchProcessor{
  patchGroups: {id: number, name:string, element:Element, details: Element, patcher: CodePatcher}[];
  lastID: number;
  currentGroup: number;

  constructor(){
    this.patchGroups = [];
    this.lastID = 0;
    this.currentGroup = -1;
  }

  importConfig(config: string){
    let configObject: {
      groups: {
        name:string,
        replacements: {
          source:string,
          target:string
        }[],
        injections: {
          position: string,
          code:string
        }[]
      }[]
    };
    try{
      configObject = JSON.parse(config);
    }
    catch(e){
      throw new Error("Config is not compatible: " + e);
    }
    configObject.groups.forEach(group => {
      const injections: PatchInjection[] = group.injections.map(
        injection => new PatchInjection(injection.code, injection.position)
      );
      const replacements: PatchReplacement[] = group.replacements.map(
        replacement => new PatchReplacement(replacement.source, replacement.target)
      );
      this.addGroup(new CodePatcher(injections, replacements), group.name);
    });
  }

  exportConfig(){
    const configObject: {
      groups: {
        name:string,
        replacements: {
          source:string,
          target:string
        }[],
        injections: {
          position: string,
          code:string
        }[]
      }[]
    } = { groups:[] };
    this.patchGroups.forEach(group=>{
      const injections: {
        position: string,
        code:string
      }[] = [];
      const replacements: {
        source: string,
        target:string
      }[] = [];
      group.patcher.injections.forEach(
        inj => injections.push({position: inj.injectionPositionRegex.source, code:inj.injectionCode})
      );
      group.patcher.replacements.forEach(
        rep => replacements.push({source: rep.sourceRegex.source, target: rep.targetRegex.source})
      );
      configObject.groups.push({name: group.name, replacements: replacements, injections: injections });
    });
    return JSON.stringify(configObject);
  }
  addGroup(patcher: CodePatcher, name: string){
    this.patchGroups.push({id: ++this.lastID, name: name, patcher: patcher});
    return -1;
  }


  process(code: string) {
    let currentCode = code;
    let successfulInjections: PatchInjectionResult[] = [];
    let successfulReplacements: PatchReplacementResult[] = [];
    let failedInjections: PatchInjectionResult[] = [];
    let failedReplacements: PatchReplacementResult[] = [];
    this.patchGroups.forEach(group=>{
      const groupResult = group.patcher.process(currentCode);
      successfulInjections = [...successfulInjections, ...groupResult.successfulInjections];
      failedInjections = [...failedInjections, ...groupResult.failedInjections];
      successfulReplacements = [...successfulReplacements, ...groupResult.successfulReplacements];
      failedReplacements = [...failedReplacements, ...groupResult.failedReplacements];
      currentCode = groupResult.patchedCode;
    });
    return new CodePatcherResult(
      successfulInjections,
      successfulReplacements,
      failedInjections,
      failedReplacements,
      code,
      currentCode
    );
  }

}

export{
  PatchReplacement,
  PatchInjection,
  PatchReplacementResult,
  PatchInjectionResult,
  CodePatcher,
  CodePatcherResult,
  PatchProcessor
};