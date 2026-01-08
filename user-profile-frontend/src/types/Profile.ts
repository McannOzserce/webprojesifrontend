export type ProfileType = {
  id: number;
  name: string;
};

export type Profile = {
  id: number;
  username: string;
  email: string;
  photo: string;
  profileType: ProfileType; // Backend'den obje olarak geliyor
};