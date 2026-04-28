export default function Announcement() {
  return (
    <div className="announcement-banner">
      Our new branch is opening soon
      <span className="arrow-right"></span>
      <style jsx>{`
        .announcement-banner {
          background-color: #be2a2a;
          color: white;
          font-weight: 600;
          padding: 10px 20px;
          position: relative;
          display: inline-block;
          font-family: Arial, sans-serif;
          font-size: 16px;
          border-radius: 0 10px 10px 0;
          user-select: none;
        }

        .arrow-right {
          position: absolute;
          right: -15px;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-top: 15px solid transparent;
          border-bottom: 15px solid transparent;
          border-left: 15px solid linear-gradient(0deg, #be2a2a -86.4%, #ef7f1a 94.15%);;
          filter: brightness(0.9);
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}
