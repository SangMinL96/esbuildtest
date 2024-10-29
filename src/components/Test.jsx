import React from "react";
import classNames from "classnames";
import style from "./Test.module.scss";
const classs = classNames.bind(style);
function Test() {
  return <div className={classs("test_sangmin")}>Testddd</div>;
}
function V1() {
  return <div></div>;
}
function V2() {
  return <div></div>;
}
function V2() {
  return <div></div>;
}

Test.V1 = V1;
Test.V2 = V2;
export default Test;
