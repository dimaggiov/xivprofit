import React, { useState } from 'react';

const Tabs = ({ tabs, defaultTab, children }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            style={{ fontWeight: tab === activeTab ? 'bold' : 'normal' }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div>{children.find((child) => child.props.label === activeTab)}</div>
    </div>
  );
};

export default Tabs;