import { useSelector } from 'react-redux';
import { v5 as uuidv5 } from 'uuid';
import { useAtomValue } from 'jotai';
import { tooltippedTextsAtom } from './components/Tooltips';

export const MY_NAMESPACE = '4549d0a3-5fc2-4a94-bf96-eb7ddf5363a4';

export const TextWithGlossaryTooltips = ({ text }) => {
  // Read jotai atom and return value with the appropriate key.
  const tooltippedTexts = useAtomValue(tooltippedTextsAtom);

  const location = useSelector((state) => state.router?.location);

  // No tooltips if user opted out
  const currentuser = useSelector((state) => state.users?.user);
  const showGlossarytooltipsUser = currentuser?.glossarytooltips ?? true;
  if (!showGlossarytooltipsUser) {
    return text;
  }

  // No tooltips on home page, in edit mode, and add mode
  if (location === undefined) {
    return text;
  }
  const isEditMode = location.pathname.slice(-5) === '/edit';
  if (isEditMode || location.pathname === '/' || !__CLIENT__) {
    return text;
  }

  try {
    uuidv5(text, MY_NAMESPACE);
  } catch (error) {
    // "RangeError: offset is out of bounds"
    // generateUUID
    // node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-browser/v35.js:36
    // console.error(error);
    return text;
  }
  let uid = uuidv5(text, MY_NAMESPACE);
  // No match in store if this route is not configured for tooltips. Return text unchanged.
  return tooltippedTexts[uid] ? tooltippedTexts[uid] : text;
};
