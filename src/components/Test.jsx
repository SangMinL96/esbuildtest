import React from "react";
import classNames from "classnames";
import style from "./Test.module.scss";

const classs = classNames.bind(style);

function Test() {
  return <div className={classs("test")}>Testddd</div>;
}

export default Test;
