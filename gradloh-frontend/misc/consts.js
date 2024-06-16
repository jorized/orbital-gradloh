import { Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get('window');

export const HEIGHT = 220;
export const OVERDRAG = 20;

//Bottom Sheet
export const SCREEN_HEIGHT = height;
export const SCREEN_WIDTH = width;
export const BOTTOM_SHEET_MARGIN = 50;

export const TEXT_INPUT_HEIGHT = Platform.OS == "android" ? SCREEN_HEIGHT * 0.4 : SCREEN_HEIGHT * 0.47; // 20% of screen height


export const LOGIN_VIEW_HEIGHT = TEXT_INPUT_HEIGHT

//Folders screen
export const Animations = [
    "fadeIn",
    "fadeInUp",
    "fadeInDown",
    "fadeInDownBig",
    "fadeInUpBig",
    "fadeInLeft",
    "fadeInLeftBig",
    "fadeInRight",
    "fadeInRightBig",
  
    "flipInX",
    "flipInY",
   
    "slideInDown",
    "slideInUp",
    "slideInLeft",
    "slideInRight",
    
    "zoomIn",
    "zoomInDown",
    "zoomInUp",
    "zoomInLeft",
    "zoomInRight",
  ]