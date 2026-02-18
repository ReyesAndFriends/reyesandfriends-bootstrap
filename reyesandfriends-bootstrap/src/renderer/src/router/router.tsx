import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import Home from '../views/Home'
import Servers from '../views/Servers'
import Databases from '../views/Databases'
import Preferences from '../views/Preferences'
import About from '../views/About'

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

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "tween", duration: 0.2 }}
            >
              <Home />
            </motion.div>
          }
        />
        <Route
          path="/http-servers"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "tween", duration: 0.2 }}
            >
              <Servers />
            </motion.div>
          }
        />

        <Route
          path="/http-servers/apache"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "tween", duration: 0.2 }}
            >
              <ApacheView />
            </motion.div>
          }
        />

        <Route
          path="/http-servers/nginx"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "tween", duration: 0.2 }}
            >
              <NginxView />
            </motion.div>
          }
        />

        <Route
          path="/databases"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "tween", duration: 0.2 }}
            >
              <Databases />
            </motion.div>
          }
        />

        <Route
          path="/databases/mysql"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "tween", duration: 0.2 }}
            >
              <MySQLView />
            </motion.div>
          }
        />

        <Route
          path="/databases/postgresql"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "tween", duration: 0.2 }}
            >
              <PostgreSQLView />
            </motion.div>
          }
        />

        <Route
          path="/secret-keys"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "tween", duration: 0.2 }}
            >
              <SecretKeys />
            </motion.div>
          }
        />

        <Route
          path="/secret-keys/flask"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "tween", duration: 0.2 }}
            >
              <FlaskView />
            </motion.div>
          }
        />

        <Route
          path="/preferences"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "tween", duration: 0.2 }}
            >
              <Preferences />
            </motion.div>
          }
        />
        <Route
          path="/about"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "tween", duration: 0.2 }}
            >
              <About />
            </motion.div>
          }
        />
      </Routes>

    </AnimatePresence>
  );
};

export default AppRoutes
