import { DevtoolsNetwork } from 'webextension-polyfill/namespaces/devtools_network';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getJson(request: DevtoolsNetwork.Request): Promise<any> {
  const cotent = (await request.getContent())[0];
  try {
    return JSON.parse(cotent);
  } catch (error) {
    return null;
  }
}
