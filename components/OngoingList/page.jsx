import { useState } from 'react';

const OngoingList = () => {
  // 1. Your data array (Condensed for brevity)
  const allProjects = [
    { name: "Anubhav Restaurants", location: "Fort" },
    { name: "South Indian Restaurants", location: "Fort" },
    { name: "National Hindu Hotel", location: "Fort" },
    { name: "Durga Bar and Restaurant", location: "Andheri (E)" },
    { name: "Saifee Hospital", location: "Charni Road" },
    { name: "Amar Fruit Juice Centre", location: "Vile Parle(W)" },
    { name: "Amber Restaurant", location: "Bandra(W)" },
    { name: "Urban Tadka", location: "Malad (W)" },
    { name: "Hotel Silver Inn", location: "Andheri (E)" },
    { name: "Shree Ambe", location: "Andheri (E)" },
    { name: "Omkar Altamount", location: "Malad" },
    { name: "Sunbeam Gurukurpa Developer", location: "Vile Parle(E)" },
    { name: "Raheja Legend Condominium", location: "Worli" },
    { name: "Lodha Crown", location: "Thane" },
    { name: "Sugan Heights", location: "Grand Road" },
    { name: "Palai Tower", location: "Goregaon" },
    { name: "Grand Pallazo", location: "Dadar" },
    { name: "VCA Square", location: "Dadar" },
    { name: "Kalpataru Magnus", location: "Bandra East" },
    { name: "Lodha Bellavue", location: "Byculla" },
    { name: "Saat Rasta properties pvt ltd", location: "Byculla" },
    { name: "Gundavali Co-operative Housing society LTD.", location: "Andheri" },
    { name: "Our select state bank of India supervising co-op HSG society", location: "Bandra" },
    { name: "Sea Kunal Corporation Pvt Ltd", location: "Colaba" },
  ];

  // 2. State to track visible count
  const [visibleCount, setVisibleCount] = useState(10);

  const showMore = () => {
    setVisibleCount((prevCount) => prevCount + 10);
  };

  const showLess = () => {
    setVisibleCount(10); // Reset to initial 10
    // Optional: Scroll back to top of list if list is long
  };

  return (
    <div className="projectlist">
      <ul className="ongoing">
        {allProjects.slice(0, visibleCount).map((project, index) => (
          <li key={index}>
            <div className="client-name">{project.name}</div>
            <span className="location-tag draw">{project.location}</span>
          </li>
        ))}
      </ul>

      <div className="button-container" style={{ marginTop: '20px', textAlign: 'center' }}>
        {visibleCount < allProjects.length ? (
          <button className="view-btn" onClick={showMore}>View More</button>
        ) : (
          <button className="view-btn" onClick={showLess}>View Less</button>
        )}
      </div>
    </div>
  );
};

export default OngoingList;