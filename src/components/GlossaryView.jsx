import React from 'react';
import { endsWith } from 'lodash';
import { Link } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { searchContent } from '@plone/volto/actions';

const GlossaryView = ({ content }) => {
  const dispatch = useDispatch();
  const pathname = useSelector((state) => state.router.location.pathname);

  React.useEffect(() => {
    dispatch(
      searchContent(pathname, {
        review_state: ['published'],
        'path.depth': 1,
        b_size: 1000,
        sort_on: 'sortable_title',
        fullobjects: true,
      }),
    );
  }, [dispatch, pathname]);

  const glossaryentries = useSelector((state) => state.search.items).filter(
    (item) => !endsWith(content['@id'], item['@id']),
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
        <section id="content-core">
          {glossaryentries?.map((item) => (
            <article key={item['@id']}>
              <h3>
                <Link to={item['@id']}>
                  <span>{item.title}</span>
                </Link>
              </h3>
              <h4>{item.variations?.join(', ')}</h4>
              <p
                dangerouslySetInnerHTML={{
                  __html: item.definition.data || item.description,
                }}
              />
            </article>
          ))}
        </section>
      </article>
    </Container>
  );
};

export default GlossaryView;
