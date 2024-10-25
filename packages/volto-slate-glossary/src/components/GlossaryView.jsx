import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container } from 'semantic-ui-react';
import cx from 'classnames';
import { getGlossaryTerms } from '../actions';
import config from '@plone/volto/registry';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const showAlphabetNavigation =
  config.settings?.glossary?.showAlphabetNavigation || true;

const GlossaryView = ({ content }) => {
  const dispatch = useDispatch();
  const pathname = useSelector((state) => state.router.location.pathname);

  React.useEffect(() => {
    dispatch(getGlossaryTerms());
  }, [dispatch, pathname]);

  const glossaryentries = useSelector(
    (state) => state.glossaryterms.result.items,
  );
  const lettersWithTerm = Object.keys(glossaryentries || {});

  return (
    <Container className="view-wrapper glossary-view">
      <article id="content">
        <header>
          <h1 className="documentFirstHeading">{content.title}</h1>
          {content.description && (
            <p className="documentDescription">{content.description}</p>
          )}
        </header>

        {showAlphabetNavigation ? (
          <div className="glossaryAlphabet">
            {alphabet.split('').map((letter) => (
              <Link
                key={letter}
                to={'#' + letter}
                className={cx(
                  'alphabetLetter',
                  `${!lettersWithTerm.includes(letter) ? 'unmatched' : 'matched'}`,
                )}
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
        ) : null}

        <section id="content-core" className="glossary">
          {Object.keys(glossaryentries || {})?.map((letter) => (
            <div key={letter}>
              <h2 id={letter} className="letter">
                {letter}
              </h2>
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
      </article>
    </Container>
  );
};

export default GlossaryView;
