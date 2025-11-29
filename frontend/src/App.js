import Container from "@mui/material/Container";
import { Routes, Route } from 'react-router-dom'
import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login } from "./pages";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import { fetchAuthMe, selectIsAuth } from "./redux/slices/auth";
import { Tags } from "./pages/Tags/Tags";
import { getApiUrl } from "./utils";

function App() {
  const dispatch = useDispatch()
  const isAuth = useSelector(selectIsAuth);

  useEffect(() => {
    dispatch(fetchAuthMe())
  }, [])

  console.log('🔧 API URL:', getApiUrl());
  console.log('🔧 REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
  console.log('🔧 NODE_ENV:', process.env.NODE_ENV);
  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/tags/:tagName" element={<Tags />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
