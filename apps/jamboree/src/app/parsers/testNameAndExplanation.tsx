import { BreakerKey } from '@parsers-jamboree/checker/breaker';
import React, { useState } from 'react';
import IconMenuRight from '~icons/mdi/menu-right';
import IconMenuDown from '~icons/mdi/menu-down';
import { CCard, CCardBody, CCollapse } from '@coreui/react';

export const TestNameAndExplanation = ({
  name,
  explanation,
  customExplanation,
}: {
  name: BreakerKey;
  explanation: string;
  customExplanation?: string;
}): React.ReactElement => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <span
        style={{ cursor: 'pointer' }}
        onClick={() => setExpanded(!expanded)}
      >
        {name} {expanded ? <IconMenuRight /> : <IconMenuDown />}
      </span>
      <CCollapse visible={expanded}>
        <CCard className="mt-3">
          <CCardBody>{explanation}</CCardBody>
        </CCard>
        {customExplanation ? (
          <CCard className="mt-3" color={'primary'}>
            <CCardBody>{customExplanation}</CCardBody>
          </CCard>
        ) : null}
      </CCollapse>
    </div>
  );
};
