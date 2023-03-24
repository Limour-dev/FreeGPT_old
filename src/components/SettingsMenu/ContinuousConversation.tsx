import Toggle from '@components/Toggle';
import useStore from '@store/store';
import React, { useEffect, useState } from 'react';

const ContinuousConversation = () => {
    const setContinuousConversation = useStore((state) => state.setContinuousConversation);

    const [isChecked, setIsChecked] = useState<boolean>(
      useStore.getState().continuousConversation
    );

    useEffect(() => {
      setContinuousConversation(isChecked);
    }, [isChecked]);

    return (
        <Toggle
          label='continuousConversation'
          isChecked={isChecked}
          setIsChecked={setIsChecked}
        />
    );
};
export default ContinuousConversation;