import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getUserLikes, getUserPosts, getUserProfile } from '../../api/user';
import { CATEGORIES } from '../../constants/categories';
import { useAuth } from '../../contexts/AuthContext';

interface Post {
  postId: number;
  title: string;
  likeCount: number;
  stars: number;
  thumbnailUrl: string;
  createdDate: string;
  viewCount: number;
}

interface UserProfile {
  nickname: string;
  region: string;
  profileImageUrl: string;
  birthDate: string;
  categories: Array<{
    id: number;
    name: string;
    categoryType: string;
  }>;
}

const categoryMap = new Map(CATEGORIES.map(cat => [cat.name, cat.koName]));

const MyPage = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser?.isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileData, postsData, likesData] = await Promise.all([
          getUserProfile(),
          getUserPosts(),
          getUserLikes()
        ]);

        setUserProfile(profileData);
        setMyPosts(postsData);
        setLikedPosts(likesData);
        console.log('내 정보:', profileData);
        console.log('내 게시물:', postsData);
        console.log('좋아요한 게시물:', likesData);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, navigate]);

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const renderStars = (rating: number) => {
    return (
      <StarWrapper>
        {Array.from({ length: 5 }, (_, index) => (
          <Star key={index} filled={index < rating}>
            ★
          </Star>
        ))}
      </StarWrapper>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/ /g, '');
  };

  if (loading) {
    return <LoadingContainer>로딩 중...</LoadingContainer>;
  }

  if (!userProfile) {
    return <ErrorContainer>프로필을 불러올 수 없습니다.</ErrorContainer>;
  }

  return (
    <Container>
      <MainLayout>
        <LeftSidebar>
          <ProfileSection>
            <EditButton onClick={handleEditProfile}>
              <img src="/edit.svg" alt="프로필 수정" />
            </EditButton>

            <ProfileImage>
              {userProfile.profileImageUrl ? (
                <img src={userProfile.profileImageUrl} alt="프로필" />
              ) : (
                <DefaultProfile />
              )}

            </ProfileImage>

            <ProfileInfo>
              <Nickname>{userProfile.nickname}</Nickname>
              <InfoRow>
                <InfoLabel>사는 지역</InfoLabel>
                <InfoValue>{userProfile.region.split(" ")[0]}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>생년월일</InfoLabel>
                <InfoValue>{formatDate(userProfile.birthDate)}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>선호 카테고리</InfoLabel>
                <InfoValue>
                  <BadgeContainer>
                    {userProfile.categories.map(cat => (
                      <Badge key={cat.id}>
                        {categoryMap.get(cat.name) || cat.name}
                      </Badge>
                    ))}
                  </BadgeContainer>
                </InfoValue>
              </InfoRow>
            </ProfileInfo>
          </ProfileSection>
        </LeftSidebar>

        <RightContent>
          <Section>
            <SectionHeader>
              <SectionTitle>좋아요</SectionTitle>
              <MoreButton>더보기 +</MoreButton>
            </SectionHeader>
            <PostGrid>
              {likedPosts.slice(0, 4).map((post) => (
                <PostCard key={post.postId}>
                  <PostImage>
                    {post.thumbnailUrl ? (
                      <img src={post.thumbnailUrl} alt={post.title} />
                    ) : (
                      <DefaultImage />
                    )}
                  </PostImage>
                  <PostInfo>
                    <PostTitle>{post.title}</PostTitle>
                    <PostStats>
                      {renderStars(post.stars)}
                      <StatsRow>
                        <StatsText><svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
                          <path d="M5.85139 2.81297C4.74889 0.218685 0.890137 0.495 0.890137 3.81079C0.890137 7.12659 5.85139 9.88982 5.85139 9.88982C5.85139 9.88982 10.8126 7.12659 10.8126 3.81079C10.8126 0.495 6.95389 0.218685 5.85139 2.81297Z" stroke="#C6C6C6" stroke-width="1.26" stroke-linecap="round" stroke-linejoin="round" />
                        </svg> {post.likeCount}</StatsText>
                        <StatsDate>{formatDate(post.createdDate)}</StatsDate>
                      </StatsRow>
                    </PostStats>
                  </PostInfo>
                </PostCard>
              ))}
            </PostGrid>
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle>내 게시물</SectionTitle>
              <MoreButton>더보기 +</MoreButton>
            </SectionHeader>
            <PostGrid>
              {myPosts.slice(0, 2).map((post) => (
                <PostCard key={post.postId}>
                  <PostImage>
                    {post.thumbnailUrl ? (
                      <img src={post.thumbnailUrl} alt={post.title} />
                    ) : (
                      <DefaultImage />
                    )}
                  </PostImage>
                  <PostInfo>
                    <PostTitle>{post.title}</PostTitle>
                    <PostStats>
                      {renderStars(post.stars)}
                      <StatsRow>
                        <StatsText><svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
                          <path d="M5.85139 2.81297C4.74889 0.218685 0.890137 0.495 0.890137 3.81079C0.890137 7.12659 5.85139 9.88982 5.85139 9.88982C5.85139 9.88982 10.8126 7.12659 10.8126 3.81079C10.8126 0.495 6.95389 0.218685 5.85139 2.81297Z" stroke="#C6C6C6" stroke-width="1.26" stroke-linecap="round" stroke-linejoin="round" />
                        </svg> {post.likeCount}</StatsText>
                        <StatsDate>{formatDate(post.createdDate)}</StatsDate>
                      </StatsRow>
                    </PostStats>
                  </PostInfo>
                </PostCard>
              ))}
            </PostGrid>
          </Section>
        </RightContent>
      </MainLayout>
    </Container>
  );
};

export default MyPage;

const Container = styled.div`
  min-width: 1350px;
  margin: 0 auto;
  margin-top: 100px;
  padding: 20px;
  font-family: 'Pretendard', sans-serif;
`;

const MainLayout = styled.div`
  display: flex;
  gap: 90px;
  align-items: flex-start;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const LeftSidebar = styled.div`
  flex: 0 0 320px;
  
  @media (max-width: 768px) {
    flex: 1;
    width: 100%;
  }
`;

const RightContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 18px;
  color: #666;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 18px;
  color: #e74c3c;
`;

const ProfileSection = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 60px 40px;
  background: white;
  border-radius: 12px;
  border: 1px solid #E2E2E2;
`;

const ProfileImage = styled.div`
  margin-bottom: 20px;
  
  img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const DefaultProfile = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '👤';
    font-size: 80px;
    color: #999;
  }
`;

const EditButton = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  width: 35px;
  height: 35px;
  cursor: pointer;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const ProfileInfo = styled.div`
  width: 100%;
`;

const Nickname = styled.h1`
  font-size: 24px;
  font-weight: 600;
  line-height: 140%; /* 33.6px */
  color: #1d1d1d;
  text-align: center;
  margin-bottom: 50px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 30px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  font-size: 16px;
  color: #C6C6C6;
  font-weight: 500;
  width: 110px;
  flex-shrink: 0;
  text-align: left;
`;

const InfoValue = styled.span`
  font-size: 16px;
  color: #1d1d1d;
  font-weight: 400;
  text-align: left;
`;

const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
`;

const Badge = styled.span`
  color: #333;
  padding: 9px 13px;
  border: 1px solid #E2E2E2;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 500;
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #1d1d1d;
`;

const MoreButton = styled.button`
  background: none;
  border: 1px solid #E2E2E2;
  border-radius: 90px;
  padding: 8px 10px;
  color: #666;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    color: #333;
  }
`;

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 210px);
  gap: 16px;
  justify-content: start;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, 210px);
    justify-content: center;
  }
`;

const PostCard = styled.div`
  width: 210px;
  height: 250px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
  }
`;

const PostImage = styled.div`
  width: 100%;
  height: 160px;
  background-color: #f0f0f0;
  flex-shrink: 0;
  border: none;
  border-radius: 12px;
  overflow: hidden;

  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
  }
`;

const DefaultImage = styled.div`
  width: 100%;
  height: 100%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 12px;
  border-radius: 12px;
  
  &::before {
    content: '이미지 없음';
  }
`;

const PostInfo = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
`;

const PostTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1d1d1d;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 30px;
  margin: 0;
`;

const PostStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 12px;
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const StarWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const Star = styled.span<{ filled: boolean; }>`
  color: ${props => props.filled ? '#ffd700' : '#e0e0e0'};
  font-size: 14px;
`;

const StatsText = styled.span`
  color: #666;
  font-size: 12px;
`;

const StatsDate = styled.span`
  color: #999;
  font-size: 11px;
`;