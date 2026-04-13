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
   * Skip enhancing with tooltip markup for some conditions.
   * Always wrap in <span> so server and client render identical DOM structure.
   */

  // No tooltips if pathname is not configured to have tooltips
  if (!tooltippedTexts?.pathname || tooltippedTexts?.pathname !== pathname) {
    return <span className="">{text}</span>;
  }

  // No tooltips if user opted out
  const showGlossarytooltipsUser = currentuser?.glossarytooltips ?? true;
  if (!showGlossarytooltipsUser) {
    return <span className="">{text}</span>;
  }

  // No tooltips on home page, in edit mode, and add mode
  if (pathname === undefined) {
    return <span className="">{text}</span>;
  }
  const isEditMode = pathname.slice(-5) === '/edit';
  if (isEditMode || pathname === '/' || !__CLIENT__) {
    return <span className="">{text}</span>;
  }

  let uid;
  try {
    uid = uuidv5(text, MY_NAMESPACE);
  } catch (error) {
    return <span className="">{text}</span>;
  }
  // No match in store if this location is not configured for tooltips. Return text unchanged.
  const newText = Object.keys(tooltippedTexts?.texts).includes(uid)
    ? tooltippedTexts.texts[uid]
    : text;
  return <span className="">{newText}</span>;
};
