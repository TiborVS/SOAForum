import re
#import os
from playwright.sync_api import Page, expect

PAGE_ROOT = "http://localhost:4000"

def test_has_title(page: Page):
    page.goto(PAGE_ROOT)

    expect(page).to_have_title(re.compile("Yet Another Forum"))
