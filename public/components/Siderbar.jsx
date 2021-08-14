import React, { useState } from "react";
import sidebarLinks from "./sidebarlinks";
import { Link, useLocation } from "react-router-dom";

function Siderbar(props) {
  const [links, set_Links] = useState(sidebarLinks);
  const loc = useLocation().pathname.split("/");

  return (
    <div class="m-sidebar">
      {links.map((link) => (
        <Link to={`/dashboard/${link.path}`}>
          <div
            key={link.id}
            className={`${link.classes.join(" ")} ${
              loc.includes(link.path) ? "active" : ""
            }`}
          >
            <h4>{link.icon}</h4>
            <h6>{link.label}</h6>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Siderbar;
