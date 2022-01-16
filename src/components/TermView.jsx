import React from 'react';
import { Container } from 'semantic-ui-react';

const TermView = ({ content }) => {
  return (
    <Container className="view-wrapper">
      <article id="content">
        <header>
          <h1 className="documentFirstHeading">{content.title}</h1>
        </header>
        <section id="content-core">
          {content.variations &&
            content.variations.map((el) => <div key={el}>{el}</div>)}
          {content.definition && (
            <p
              dangerouslySetInnerHTML={{
                __html: content.definition.data || content.description,
              }}
            />
          )}
        </section>
      </article>
    </Container>
  );
};

export default TermView;
