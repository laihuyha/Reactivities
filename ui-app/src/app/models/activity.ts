import { User } from "./user";

interface Activity {
  id: string;
  title: string;
  date: string;
  description: string;
  category: string;
  city: string;
  venue: string;
  attendees?: ActivityAttendee[];
}

interface ActivityAttendee {
  appUserId: string;
  appUser: User;
  activityId: string;
  activity: Activity;
  isHost: boolean;
}

export default Activity;
