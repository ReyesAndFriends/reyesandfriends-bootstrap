import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import Home from '../views/Home'
import Servers from '../views/Servers'
import Databases from '../views/Databases'
import Preferences from '../views/Preferences'
import About from '../views/About'
import TermsAndConditions from '@renderer/views/TermsAndConditions'
import ApacheView from '@renderer/views/servers/apache/ApacheView'
import NginxView from '@renderer/views/servers/nginx/NginxView'
import MySQLView from '@renderer/views/databases/mysql/MySQLView'
import PostgreSQLView from '@renderer/views/databases/postgresql/PostgreSQLView'
import FlaskView from '@renderer/views/secrets/flask/FlaskView'
import SecretKeys from '@renderer/views/SecretKeys'


const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

function getAnimatedRoute(path: string, element: React.ReactNode) {
  return (
    <Route
      key={path}
      path={path}
      element={
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: "tween", duration: 0.2 }}
        >
          {element}
        </motion.div>
      }
    />
  );
}


const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {getAnimatedRoute("/", <Home />)}
        {getAnimatedRoute("/http-servers", <Servers />)}
        {getAnimatedRoute("/http-servers/apache", <ApacheView />)}
        {getAnimatedRoute("/http-servers/nginx", <NginxView />)}
        {getAnimatedRoute("/databases", <Databases />)}
        {getAnimatedRoute("/databases/mysql", <MySQLView />)}
        {getAnimatedRoute("/databases/postgresql", <PostgreSQLView />)}
        {getAnimatedRoute("/secret-keys", <SecretKeys />)}
        {getAnimatedRoute("/secret-keys/flask", <FlaskView />)}
        {getAnimatedRoute("/preferences", <Preferences />)}
        {getAnimatedRoute("/about", <About />)}
        {getAnimatedRoute("/terms-and-conditions", <TermsAndConditions />)}
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes
