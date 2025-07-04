import styled from "styled-components"
import MainList from "./MainList"
import MainRight from "./MainRight"

const Main=()=>{
return(
<Layout >
    <MainList/>
    <MainRight/>
</Layout>

)
}

export default Main

const Layout = styled.div`
  display  :flex;
  flex-direction: row;
  justify-content: space-between;
`;