import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';
import { flattenToAppURL } from '@plone/volto/helpers';
import backSVG from '@plone/volto/icons/back.svg';

const TermView = ({ content }) => {
  return (
    <>
      <Container className="view-wrapper">
        <article id="content">
          <header>
            <h1 className="documentFirstHeading">{content.title}</h1>
          </header>
          <section id="content-core">
            {content.variants && (
              <dl className="variants">
                {content.variants.map((el) => (
                  <dt key={el}>{el}</dt>
                ))}
              </dl>
            )}
            {content.definition && (
              <p
                dangerouslySetInnerHTML={{
                  __html: content.definition?.data || '',
                }}
              />
            )}
            <Link to={flattenToAppURL(content.parent['@id'])} className="item">
              <Icon
                name={backSVG}
                className="contents circled"
                size="30px"
                title="back"
              />
            </Link>
          </section>
        </article>
      </Container>
    </>
  );
};

export default TermView;
