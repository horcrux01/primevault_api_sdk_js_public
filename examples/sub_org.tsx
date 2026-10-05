import { APIClient, SubOrg } from "../src";

export const createAndListSubOrgs = async (
  apiClient: APIClient,
): Promise<SubOrg[]> => {
  await apiClient.createSubOrg({
    name: "Acme customer",
  });

  const subOrgs: SubOrg[] = [];
  let cursor: string | null = null;
  do {
    const page = await apiClient.getSubOrgs({ name: "%Acme%" }, 20, cursor);
    subOrgs.push(...page.results);
    cursor = page.nextCursor;
  } while (cursor);
  return subOrgs;
};
