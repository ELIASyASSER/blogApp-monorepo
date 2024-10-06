import './App.css';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'

import Login from './layout/Login';
import Layout from './layout/layout';
import Home from './layout/home';
import Register from './layout/register';
import CreatePost from './createPost';
import PostPage from './layout/PostPage';
import EditPost from './layout/editPost';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout/>}>
          < Route index element={<Home/>}/>      
          < Route path='/login' element={<Login />}/>
          < Route path='/register' element={<Register />}/>
          < Route path='/createPost' element={<CreatePost />}/>
          <Route path='/post/:id' element={<PostPage/>}/>
          <Route path='/editPost/:id' element={<EditPost/>}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App;
