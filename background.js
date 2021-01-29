// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

"use strict";

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ color: "#3aa757" }, function () {
    console.log("The color is green.");
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: "developer.chrome.com" },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // console.log("tab changed!");
  // console.log(changeInfo);

  if (changeInfo.status == "complete" && tab.active) {
    function modifyDOM() {
      function waitForElm(selector) {
        return new Promise((resolve) => {
          if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
          }

          const observer = new MutationObserver((mutations) => {
            if (document.querySelector(selector)) {
              resolve(document.querySelector(selector));
              observer.disconnect();
            }
          });

          observer.observe(document.body, {
            childList: true,
            subtree: true,
          });
        });
      }
      if (
        document.location.toString() === "https://app.hatchinvest.nz/portfolio"
      ) {
        waitForElm(".investment-overview h2").then((elm) => {
          console.log("sCROLL_INTO_VIEW:", elm);
          elm.scrollIntoView();
        });
      }
    }

    //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
    chrome.tabs.executeScript({
      code: "(" + modifyDOM + ")();", //argument here is a string but function.toString() returns function's code
    });
  }
});
