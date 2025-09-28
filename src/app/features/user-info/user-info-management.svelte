<script lang="ts">
  import type { UserInfoFeature } from "@/app/features/user-info/user-info.feature";
  import FlatButton from "@/lib/flat-button/flat-button.svelte";

  export let feature: UserInfoFeature;
  let token = "";
</script>
<h3>Emergency Login</h3>
<div>If the regular login is not working, you may log in here with a secret code that you can receive from the administrator.</div>
<br>
<div>
  <input style="width: auto" bind:value={token} type="text" placeholder="Enter token"/>
  <FlatButton color="green" content="Log In" on:click={() => {feature.setToken(token); token = "";}} />
</div>