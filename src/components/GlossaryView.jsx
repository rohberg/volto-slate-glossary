import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { getGlossaryTerms } from '../actions';

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
    <Container className="view-wrapper">
      <article id="content">
        <header>
          <h1 className="documentFirstHeading">{content.title}</h1>
          {content.description && (
            <p className="documentDescription">{content.description}</p>
          )}
        </header>
        <section id="content-core" className="glossary">
          {Object.keys(glossaryentries || {})?.map((letter) => (
            <div key={letter}>
              <h2 className="letter">{letter}</h2>
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
