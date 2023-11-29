import React from "react";
import classNames from "classnames";
import style from "./Test2.module.scss";
const classs = classNames.bind(style);
function Test2() {
  return <div className={classs("test2_sangmin")}>Test2ddd</div>;
}

export default Test2;
