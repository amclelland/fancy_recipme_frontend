define("recipme-ember/templates/meals/index/new", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.6.0",
          "loc": {
            "source": null,
            "start": {
              "line": 6,
              "column": 4
            },
            "end": {
              "line": 6,
              "column": 52
            }
          },
          "moduleName": "recipme-ember/templates/meals/index/new.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Create");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "triple-curlies"
        },
        "revision": "Ember@2.6.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 9,
            "column": 0
          }
        },
        "moduleName": "recipme-ember/templates/meals/index/new.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "new-meal-box");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h2");
        var el3 = dom.createTextNode("Create New Meal");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("form");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 3]);
        var morphs = new Array(4);
        morphs[0] = dom.createElementMorph(element0);
        morphs[1] = dom.createMorphAt(element0, 1, 1);
        morphs[2] = dom.createMorphAt(element0, 3, 3);
        morphs[3] = dom.createMorphAt(element0, 5, 5);
        return morphs;
      },
      statements: [["element", "action", ["create"], ["on", "submit"], ["loc", [null, [3, 8], [3, 39]]]], ["inline", "paper-input", [], ["label", "Name", "value", ["subexpr", "@mut", [["get", "model.name", ["loc", [null, [4, 37], [4, 47]]]]], [], []], "required", true, "icon", "comment"], ["loc", [null, [4, 4], [4, 78]]]], ["inline", "paper-input", [], ["label", "Image URL", "value", ["subexpr", "@mut", [["get", "model.image", ["loc", [null, [5, 42], [5, 53]]]]], [], []], "required", true, "icon", "image"], ["loc", [null, [5, 4], [5, 82]]]], ["block", "paper-button", [], ["raised", true, "primary", true], 0, null, ["loc", [null, [6, 4], [6, 69]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});