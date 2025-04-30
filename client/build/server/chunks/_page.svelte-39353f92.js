import { c as create_ssr_component, v as validate_component, b as add_attribute, d as each, e as escape } from './ssr-42e5b568.js';
import { w as writable } from './index-a259a396.js';

const tasks = writable([]);
const SentenceAdd = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let sentence;
  return `<div><form><div class="form-group"><h3 data-svelte-h="svelte-1r3ur8h">Sentence:</h3> <input placeholder="Enter sentence to be translated" class="form-control"${add_attribute("value", sentence, 0)}></div> <button class="btn btn-primary" data-svelte-h="svelte-8grufi">Submit</button></form></div>`;
});
const CardReveal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { card = {} } = $$props;
  if ($$props.card === void 0 && $$bindings.card && card !== void 0)
    $$bindings.card(card);
  return `<div class="row"><div class="text-center">Sentence: <br> <div class="card"><div class="card-body">${escape(card.sentence)}</div></div>

        Translation: <br> <div class="card"><div class="card-body">${escape(card.translation)}</div></div>
        Score: ${escape(card.score)} Multiplier: ${escape(card.multiplier)}<br> <button class="btn btn-outline-danger" data-svelte-h="svelte-1cn07bk">Reset</button> <button class="btn btn-outline-warning" data-svelte-h="svelte-1inmo50">Hard</button> <button class="btn btn-outline-success" data-svelte-h="svelte-1plc6re">Good</button></div></div>`;
});
const CardHidden = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { card = {} } = $$props;
  if ($$props.card === void 0 && $$bindings.card && card !== void 0)
    $$bindings.card(card);
  return `<div class="row"><div class="text-center">Sentence: <br> <div class="card"><div class="card-body">${escape(card.sentence)}</div></div></div></div>`;
});
const CardRead = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let filteredItems;
  let cards = [];
  let state = 0;
  tasks.subscribe(async (_cards) => {
    cards = await _cards;
    console.log("Subscribe me: ");
    console.log(cards);
    state = 0;
    console.log(state);
  });
  filteredItems = cards.slice(1, 4);
  return `<div class="row"><div class="col-md-8 mx-auto"><div class="text-center"><h3 data-svelte-h="svelte-194hwis">Card Review</h3> <hr> ${Array.isArray(cards) && cards.length ? `${state == 0 ? `${validate_component(CardHidden, "CardHidden").$$render($$result, { card: cards[0] }, {}, {})} <button class="btn btn-primary" data-svelte-h="svelte-d4c2sk">Reveal</button> <br>` : `${validate_component(CardReveal, "CardReveal").$$render($$result, { card: cards[0] }, {}, {})} <br>`} <hr>
                Upcoming Cards:<br> ${each(filteredItems, (card) => {
    return `${escape(card.sentence)} <br>`;
  })}` : `There are no cards to display`}</div></div></div>`;
});
const DropButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div><form data-svelte-h="svelte-1nd4l0t"><div class="form-group"><h3>Drop All Data Stores</h3></div> <button class="btn btn-danger">Drop</button></form></div>`;
});
const AtlasApp = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="container">${validate_component(SentenceAdd, "SentenceAdd").$$render($$result, {}, {}, {})} ${validate_component(DropButton, "DropButton").$$render($$result, {}, {}, {})} <hr> ${validate_component(CardRead, "CardRead").$$render($$result, {}, {}, {})}</div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(AtlasApp, "AtlasApp").$$render($$result, {}, {}, {})}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-39353f92.js.map
