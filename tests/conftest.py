import os
import pytest
from dotenv import load_dotenv

load_dotenv()

SITE_ROOT = os.environ["SITE_ROOT"]
TEST_USER_EMAIL = os.environ["TEST_USER_EMAIL"]
TEST_USER_PASSWORD = os.environ["TEST_USER_PASSWORD"]
SECOND_TEST_USER_EMAIL = os.environ["SECOND_TEST_USER_EMAIL"]
SECOND_TEST_USER_PASSWORD = os.environ["SECOND_TEST_USER_PASSWORD"]

LOGIN_STATE_LOCATION = ".auth/state.json"

@pytest.fixture(scope="session")
def login(browser):
    context = browser.new_context()
    page = context.new_page()
    page.goto(SITE_ROOT + "/login")
    page.get_by_role("textbox", name="E-mail").fill(TEST_USER_EMAIL)
    page.get_by_role("textbox", name="Password").fill(TEST_USER_PASSWORD)
    page.get_by_role("button", name="Log in").click()
    page.wait_for_url(SITE_ROOT)
    context.storage_state(path=LOGIN_STATE_LOCATION)
    context.close()

    return LOGIN_STATE_LOCATION

@pytest.fixture
def user_logged_in(browser, login):
    context = browser.new_context(storage_state=login)
    yield context
    context.close()

@pytest.fixture
def second_user_section(browser):
    context = browser.new_context()
    page = context.new_page()

    page.goto(SITE_ROOT + "/login")
    page.get_by_role("textbox", name="E-mail").fill(SECOND_TEST_USER_EMAIL)
    page.get_by_role("textbox", name="Password").fill(SECOND_TEST_USER_PASSWORD)
    page.get_by_role("button", name="Log in").click()
    page.wait_for_url(SITE_ROOT)

    page.get_by_role("textbox", name="Title").fill("Test section")
    page.get_by_role("button", name="Create section").click()

    yield

    page.get_by_role("button", name="Delete").click()
    context.close()
