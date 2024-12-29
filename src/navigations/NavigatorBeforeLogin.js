import React from 'react'

import { BrowserRouter as Route, Routes} from "react-router-dom";
import Login from '../pages/login/Login';

export default function NavigatorBeforeLogin() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}
