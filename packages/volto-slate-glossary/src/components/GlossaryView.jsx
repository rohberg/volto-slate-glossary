import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getGlossaryTerms } from '../actions';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const GlossaryView = ({ content }) => {
  const dispatch = useDispatch();
  const pathname = useSelector((state) => state.router.location.pathname);

  React.useEffect(() => {
    dispatch(getGlossaryTerms());
  }, [dispatch, pathname]);

  let glossaryentries = useSelector(
    (state) => state.glossaryterms.result.items,
  );

  return (
    <div id="page-document" className="q-container">
      <div className="blocks-group-wrapper transparent">
        <h1 className="documentFirstHeading">{content.title}</h1>
        {content.description && (
          <p className="documentDescription">{content.description}</p>
        )}

        <div className="glossaryAlphabet">
          {alphabet.split('').map((letter) => (
            <Link
              key={letter}
              to={'#' + letter}
              className="alphabetLetter"
              onClick={() => {
                document
                  .getElementById(letter)
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>{letter}</span>
            </Link>
          ))}
        </div>

        <section className="glossary">
          {Object.keys(glossaryentries || {})?.map((letter) => (
            <div key={letter}>
              <a id={letter} anchor={letter} href={false}>
                <h2 className="letter">{letter}</h2>
              </a>
              {glossaryentries[letter].map((item) => (
                <article className="term" key={item['@id']}>
                  <h3>
                    <Link to={item['@id']}>{item.title}</Link>
                    {item.terms && item.terms.length > 0 && (
                      <span className="variants">
                        {' '}
                        - {item.terms?.join(', ')}
                      </span>
                    )}
                  </h3>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: item.definition || '',
                    }}
                  />
                </article>
              ))}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default GlossaryView;
