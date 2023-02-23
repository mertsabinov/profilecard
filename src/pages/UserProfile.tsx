import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/Firebase';
import { Links, UserCard } from '../types';
import Loading from '../components/Loading';
import MetaTag from '../components/MetaTag';
import UserProfileLayout from '../components/layout/UserProfileLayout';
import UserProfileFooter from '../components/UserProfileFooter';
import DefaultProfile from '../components/ProfileTheme/free/DefaultProfile';
import PremiumProfileCard1 from '../components/ProfileTheme/premium/PremiumProfileCard1';

const UserProfile = () => {
  const { user } = useParams();
  const navigate = useNavigate();

  const [userDeteil, setUserDeteil] = useState<UserCard>();
  const [linkList, setLinkList] = useState<Links[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userTheme, setUserTheme] = useState<string>('');

  useEffect(() => {
    getUserDeteilFromDB(user || '');
  }, []);

  // This function checks if a username matches a username
  // in the Firebase database.If there is a match,
  // it retrieves the user information,
  // otherwise it directs the user to a 404 page.
  const getUserDeteilFromDB = async (userName: string) => {
    setLoading(true);
    const q = query(collection(db, 'users'), where('username', '==', userName));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size === 0) {
      navigate('/404');
    }

    querySnapshot.forEach(async doc => {
      await setUserDeteil(doc.data() as UserCard);
      await setLinkList(doc.data().links);
      await setUserTheme(doc.data().theme);
    });

    setLoading(false);
  };

  const theme = (theme: string) => {
    switch (theme) {
      case 'DefaultProfile':
        return (
          <DefaultProfile
            linkList={linkList}
            userDeteil={userDeteil as UserCard}
          />
        );
      case 'PremiumProfileCard1':
        return (
          <PremiumProfileCard1
            linkList={linkList}
            userDeteil={userDeteil as UserCard}
          />
        );

      default:
        return (
          <DefaultProfile
            linkList={linkList}
            userDeteil={userDeteil as UserCard}
          />
        );
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <>
      <UserProfileLayout>
        <MetaTag
          title={`ProfileCard  ${
            userDeteil ? userDeteil.username : 'ProfileCard'
          }`}
          content={userDeteil ? userDeteil.username : 'ProfileCard'}
        />
        {theme(userTheme)}
      </UserProfileLayout>
      <UserProfileFooter />
    </>
  );
};

export default UserProfile;
