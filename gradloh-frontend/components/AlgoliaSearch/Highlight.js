import React, { Fragment } from 'react';
import { StyleSheet, Text } from 'react-native';
import { getHighlightedParts, getPropertyByPath } from 'instantsearch.js/es/lib/utils';

function HighlightPart({ children, style }) {
  return <Text style={style}>{children}</Text>;
}

export function Highlight({ hit, attribute, separator = ', ', highlightedStyle, nonHighlightedStyle }) {
  const { value: attributeValue = '' } = getPropertyByPath(hit._highlightResult, attribute) || {};
  const parts = getHighlightedParts(attributeValue);

  return (
    <>
      {parts.map((part, partIndex) => {
        if (Array.isArray(part)) {
          const isLastPart = partIndex === parts.length - 1;

          return (
            <Fragment key={partIndex}>
              {part.map((subPart, subPartIndex) => (
                <HighlightPart
                  key={subPartIndex}
                  isHighlighted={subPart.isHighlighted}
                  style={subPart.isHighlighted ? highlightedStyle : nonHighlightedStyle}
                >
                  {subPart.value}
                </HighlightPart>
              ))}

              {!isLastPart && separator}
            </Fragment>
          );
        }

        return (
          <HighlightPart
            key={partIndex}
            isHighlighted={part.isHighlighted}
            style={part.isHighlighted ? highlightedStyle : nonHighlightedStyle}
          >
            {part.value}
          </HighlightPart>
        );
      })}
    </>
  );
}

