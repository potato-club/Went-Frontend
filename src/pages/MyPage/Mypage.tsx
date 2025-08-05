import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getUserLikes, getUserPosts, getUserProfile } from '../../api/user';
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
        return Array.from({ length: 5 }, (_, index) => (
            <Star key={index} filled={index < rating}>
                ★
            </Star>
        ));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\./g, '/').replace(/ /g, '');
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
                                <InfoValue>{userProfile.region}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>생년월일</InfoLabel>
                                <InfoValue>{formatDate(userProfile.birthDate)}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>선호 카테고리</InfoLabel>
                                <InfoValue>{userProfile.categories.map(cat => cat.name).join(', ')}</InfoValue>
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
                                            <StatsText>♥ {post.likeCount}</StatsText>
                                            <StatsDate>{formatDate(post.createdDate)}</StatsDate>
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
                                            <StatsText>♥ {post.likeCount}</StatsText>
                                            <StatsDate>{formatDate(post.createdDate)}</StatsDate>
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
  min-width: 1200px;
  margin: 0 auto;
  margin-top: 100px;
  padding: 20px;
  font-family: 'Pretendard', sans-serif;
`;

const MainLayout = styled.div`
  display: flex;
  gap: 40px;
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
  padding: 60px 80px;
  background: white;
  border-radius: 12px;
  border: 1px solid #E2E2E2;
`;

const ProfileImage = styled.div`
  margin-bottom: 20px;
  
  img {
    width: 200px;
    height: 200px;
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
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #1d1d1d;
  text-align: center;
`;

const InfoRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  align-items: flex-start;
  text-align: left;
`;

const InfoLabel = styled.span`
  font-size: 14px;
  color: #666;
  font-weight: 500;
  margin-bottom: 4px;
`;

const InfoValue = styled.span`
  font-size: 16px;
  color: #1d1d1d;
  font-weight: 400;
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
  border: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    color: #333;
  }
`;

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
`;

const PostCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const PostImage = styled.div`
  width: 100%;
  height: 160px;
  background-color: #f0f0f0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
  font-size: 14px;
  
  &::before {
    content: '이미지 없음';
  }
`;

const PostInfo = styled.div`
  padding: 16px;
`;

const PostTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1d1d1d;
  margin-bottom: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PostStats = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
`;

const Star = styled.span<{ filled: boolean; }>`
  color: ${props => props.filled ? '#ffd700' : '#e0e0e0'};
  font-size: 16px;
`;

const StatsText = styled.span`
  color: #666;
  margin-left: 8px;
`;

const StatsDate = styled.span`
  color: #999;
  margin-left: auto;
`;