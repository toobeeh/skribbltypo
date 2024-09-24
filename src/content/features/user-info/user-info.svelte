<script lang="ts">
  import { UserInfoFeature } from "./user-info.feature";

  console.log("hi");
  export let feature: UserInfoFeature;
</script>

<div>
  {feature.description}
</div>