const Background = document.querySelector("#Background");
const Title = document.querySelector("#Title");
const Title1 = document.querySelector("#Title1");
const Title2 = document.querySelector("#Title2");
const text = document.querySelector("#text");
const W = document.querySelector("#W");
const Imgs = document.querySelectorAll("img");
const buttons = document.querySelectorAll(".wrapper section");

buttons.forEach((button,index) => {

button.addEventListener("click", () => {

buttons.forEach(btn => {
if (btn !== button && btn.classList.contains("active")) {btn.classList.remove("active");}});
button.classList.toggle("active");

document.querySelector(".Active").classList.remove("Active");
Imgs[index].classList.add("Active");

Title.style.top="700px";text.style.top="700px";
Title.style.opacity="0";Title.style.transition="0s";
text.style.opacity="0";text.style.transition="0s";

setTimeout(() => {
Title.style.top="var(--i1)";text.style.top="var(--i2)";
Title.style.opacity="1";Title.style.transition="0.8s";text.style.opacity="1";text.style.transition="0.5s 0.5s";},0);

const iceCreams = [
  {bg: "#ffd4e4", color: "#ff3884", title: "Strawberry", text: "Strawberry ice cream mixed with small pieces of fresh strawberries."},
  {bg: "#baffe9", color: "#03fcad", title: "Mint", text: "Mint ice cream topped with fresh mint leaves and chocolate chips."},
  {bg: "#fcffba", color: "#fce303", title: "Mango", text: "Mango ice cream mixed with small cubes of fresh mango."},
  {bg: "#8ceeff", color: "#00c3e6", title: "Blueberry", text: "Blueberry ice cream infused with fresh blueberries and topped with mint leaves."},
  {bg: "#fffef2", color: "#a1a08c", title: "Vanilla", text: "Vanilla ice cream topped with fresh mint leaves."},
  {bg: "#ab816a", color: "#703616", title: "Chocolate", text: "Chocolate ice cream garnished with chocolate sauce."},
  {bg: "#d3ffc2", color: "#61a13b", title: "Pistachio", text: "Pistachio ice cream garnished with pistachio and fresh mint leaves."},
  {bg: "#fae7a7", color: "#d9a600", title: "Peanut Butter", text: "Peanut Butter ice cream topped with peanut butter sauce."}
];

const iceCream = iceCreams[index];

Background.style.background = iceCream.bg;
document.body.style.background = iceCream.bg;
Title1.style.color = iceCream.color;
Title2.style.color = iceCream.color;
Title1.innerHTML = iceCream.title;
Title2.innerHTML = "Ice Cream";
text.innerHTML = iceCream.text;

});

W.addEventListener("click", () => {
buttons.forEach(btn => {
if(btn.classList.contains("active")) {btn.classList.remove("active");}});});

});
