import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import UserProfileSetupPage from '../../components/UserProfileSetupPage';
import AdditionalDetailsPage from '../../components/AdditionalDetailsPage';
import { Title, SubTitle } from '../../styles/LayoutStyles';
import LoginPageWrapper from '../../components/LoginPageWrapper';

function SignupPage() {}

function SignUpPage() {
  const { step } = useParams();
  // const [nickname, setNickname] = useState('');
  // const [selectedLocation, setSelectedLocation] = useState('');
  // const [selectedInterests, setSelectedInterests] = useState<string[]>([]); // State for selected interests

  return (
    <LoginPageWrapper>
      <Title>(), 다녀왔습니다.</Title>

      {step === '1' && <UserProfileSetupPage />}
      {step === '2' && <AdditionalDetailsPage />}
    </LoginPageWrapper>
  );
}

export default SignUpPage;
