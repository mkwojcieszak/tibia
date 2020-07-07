import './scss/main.scss';
// import {TweenMax, TimelineMax, CSSPlugin, AttrPlugin, BezierPlugin, TweenPlugin } from "gsap/all";
// const plugins = [ CSSPlugin, AttrPlugin, BezierPlugin, TweenPlugin ];
import { startUserInterface } from './js/userInterface.js';
import { startLoginInterface } from './js/loginInterface.js';
import { openController } from './js/controller.js';
import { openLoginController } from './js/loginController.js';
$ = jQuery = require('jquery');

function startWebsite() {
    $.ajax({
        type: "POST",
        dataType: "JSON",
        url: "./php/users/loadUser.php",
        data: {},
        success: (ret) => {
            if (ret.fb == "success") {
                controller = openController(ret.id, ret.login, ret.power);
                userInterface = startUserInterface(controller);
            } else if (ret.fb == "no session") {
                controller = openLoginController();
                loginInterface = startLoginInterface();
            } else if (ret.fb == "user does not exist") {
                location.href="./php/users/logout.php";
            }
            document.querySelector('body').removeChild(document.querySelector('#loading'));
        }
        
    });
}

let site = document.querySelector('#site');
let controller = 0;
let userInterface = 0;
let loginInterface = 0;

startWebsite();






































