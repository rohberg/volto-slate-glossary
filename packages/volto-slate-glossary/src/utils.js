import { useSelector } from 'react-redux';
import { v5 as uuidv5 } from 'uuid';
import { atom, useAtomValue } from 'jotai';

// Jotai store for tooltip enhanced slate leafs
export const tooltippedTextsAtom = atom({ pathname: undefined, texts: [] });

export const MY_NAMESPACE = '4549d0a3-5fc2-4a94-bf96-eb7ddf5363a4';

/**
 * TextWithGlossaryTooltips
 *
 * returns enhanced markup from Jotai store if
 * - location should show tooltips
 * - current user has not opted out
 * - page is in view mode
 *
 * @param {String} text
 * @returns String
 */
export const TextWithGlossaryTooltips = ({ text }) => {
  const location = useSelector((state) => state.router?.location);
  const pathname = location?.pathname;

  // Read Jotai atom and return value with the appropriate key.
  const tooltippedTexts = useAtomValue(tooltippedTextsAtom);

  const currentuser = useSelector((state) => state.users?.user);

  /**
   * Skip enhancing with tooltip markup for some conditions
   */

  // No tooltips if pathname is not configured to have tooltips
  if (!tooltippedTexts?.pathname || tooltippedTexts?.pathname !== pathname) {
    return text;
  }

  // No tooltips if user opted out
  const showGlossarytooltipsUser = currentuser?.glossarytooltips ?? true;
  if (!showGlossarytooltipsUser) {
    return text;
  }

  // No tooltips on home page, in edit mode, and add mode
  if (pathname === undefined) {
    return text;
  }
  const isEditMode = pathname.slice(-5) === '/edit';
  if (isEditMode || pathname === '/' || !__CLIENT__) {
    return text;
  }

  let uid;
  try {
    uid = uuidv5(text, MY_NAMESPACE);
  } catch (error) {
    // "RangeError: offset is out of bounds"
    // generateUUID
    // node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-browser/v35.js:36
    // console.error(error);
    return text;
  }
  // No match in store if this location is not configured for tooltips. Return text unchanged.
  const newText = Object.keys(tooltippedTexts?.texts).includes(uid)
    ? tooltippedTexts.texts[uid]
    : text;
  return newText;
};
