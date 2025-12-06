import re
import os
from playwright.sync_api import Page, expect
import pytest
from dotenv import load_dotenv

load_dotenv()

SITE_ROOT = os.environ["SITE_ROOT"]
TEST_USER_EMAIL = os.environ["TEST_USER_EMAIL"]
TEST_USER_PASSWORD = os.environ["TEST_USER_PASSWORD"]

LOGIN_STATE_LOCATION = ".auth/state.json"

@pytest.fixture(scope="session")
def login(browser):
    context = browser.new_context()
    page = context.new_page()
    page.goto(SITE_ROOT + "/login")
    page.get_by_role("textbox", name="E-mail").click()
    page.get_by_role("textbox", name="E-mail").fill(TEST_USER_EMAIL)
    page.get_by_role("textbox", name="Password").click()
    page.get_by_role("textbox", name="Password").fill(TEST_USER_PASSWORD)
    page.get_by_role("button", name="Log in").click()
    context.storage_state(path=LOGIN_STATE_LOCATION)
    context.close()

    return LOGIN_STATE_LOCATION

@pytest.fixture
def user_logged_in(browser, login):
    context = browser.new_context(storage_state=login)
    yield context
    context.close()

def test_has_title(page: Page):
    page.goto(SITE_ROOT)

    expect(page).to_have_title(re.compile("Yet Another Forum"))

def test_is_username_displayed(user_logged_in):
    page = user_logged_in.new_page()
    page.goto(SITE_ROOT)
    expect(page.get_by_text("abc").first).to_be_visible()
