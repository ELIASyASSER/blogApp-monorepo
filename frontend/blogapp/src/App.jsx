import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'

import './styles/App.css';
import './styles/index.css';

import Login from './components/Login';
import Layout from './components/layout';
import Home from './components/home';
import Register from './components/register';
import CreatePost from './components/createPost';
import PostPage from './components/PostPage';
import EditPost from './components/editPost';

import ProtectedRoutes from './utils/protectedRoute';
import NotFoundPage from './utils/notFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout/>}>
          < Route index element={<Home/>}/>      
          < Route path='/login' element={<Login />}/>
          < Route path='/register' element={<Register />}/>
          <Route element={<ProtectedRoutes/>}>
              < Route path='/createPost' element={<CreatePost />}/>
              <Route path='/post/:id' element={<PostPage/>}/>
              <Route path='/editPost/:id' element={<EditPost/>}/>
          </Route>
        </Route>
              < Route path='*' element={<NotFoundPage/>}/>
      </Routes>
    </Router>
  )
}

export default App;
