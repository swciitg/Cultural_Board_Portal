import React from 'react';
import { Link } from 'react-router-dom';
import { useAnnouncementsPageData } from '../hooks/useAnnouncementsPageData';

const Ticker = () => {
  const { data, loading, error } = useAnnouncementsPageData();

  if (loading) {
    return null;
  }

  if (error) {
    return null;
  }

  const announcements = Array.isArray(data.announcements) ? data.announcements : [data.announcements];
  const latestAnnouncements = announcements.slice(0, 5);

  return (
    <div className="bg-[#7BB9C4] py-2 sm:py-0 text-white overflow-hidden w-full">
      <div className="flex items-center">
      <div className="hidden z-20 sm:block px-2 md:px-4 py-2 text-xs md:text-sm bg-rose-500 font-bold whitespace-nowrap rounded-r-lg">
        LATEST ANNOUNCEMENTS:
      </div>
      <div className="flex animate-ticker py-2.2 md:py-1.9 whitespace-nowrap">
          {latestAnnouncements.map((announcement) => (
            <div className="px-4" key={announcement._id}>
              <Link to="/announcements" className="hover:underline">
                {announcement.title}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ticker;