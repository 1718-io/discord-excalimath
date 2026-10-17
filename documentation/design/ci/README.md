# Ci

We want that (pipelines) :

-> one is triggered to run thoses tests and units tests also, on feature or bugfix branches, that are created from the `develop` branch, and iff a PR is opened with `develop` as target. No deployement there. We want the most beautiful test report results in the PR discussion.

-> one runs all the tests on the `develop` branh at every new commit, and especially hen a PR is merged into `develop`, if tests are succesful i want a deployment.

To get that beautiful test report in your PR discussion, we will use the official `dorny/test-reporter` action. It reads the test results and writes a clean markdown summary table directly to the PR comments.

Ensure your `package.json` test script supports standard TAP or JUnit output if needed, or use a reporter. Since we are using `tsx --test tests/*.test.ts`, Node's built-in test runner outputs TAP natively.

Github actions behavior:

* Feature Branches (`feature/xyz` or `bugfix/xyz`): Pushing code runs your test runner silently in the background of the commit check.

* Pull Request to `develop`: Runs the tests, aggregates the results, and posts a neat interactive test summary directly onto the GitHub PR timeline. If tests fail, the PR is blocked from merging.

Merge into `develop` / Commit to `develop`: Runs the test suite to ensure main development code stays clean, and if successful, triggers your Render backend deployment automatically.

Add-on: Configure Branch Protection Rules on GitHub to enforce that these tests must pass before a PR can be merged

1.Navigate to Repository Settings :GitHub Web UI.

Go to your repository on GitHub, click the Settings tab at the top, select Branches from the left-hand sidebar under "Code and automation", and click Add branch protection rule (or edit an existing one for `develop`).

Verification: You should see a form labeled "Branch name pattern".

2.Specify the Target Branch :**Branch Name Pattern**.

In the Branch name pattern field, type `develop` to target your main development branch.Verification: The input field contains develop.

3.Enable Status Checks :**Merge Requirements**.

Check the box for Require status checks to pass before merging. If you want to ensure branches are up to date with `develop` before merging, you can also check Require branches to be up to date before merging.

Verification: Additional configuration options appear underneath allowing you to search for status checks.

4.Select Required Status Checks :**Job Name Matching**.

In the search box under status checks, type the exact name of the job from your GitHub Actions workflow (e.g., Run Tests & Report from your ci-pr.yml file) and select it.
Verification: The job name appears in the list of required checks with a toggle enabled.

5.Save Changes :Finalize Configuration.

Scroll to the bottom of the page and click Create changes or Save changes.

You may be asked to confirm your GitHub password.

Verification:

* Your rule appears in the active "Branch protection rules" list,
* and opening a pull request into `develop` will now show the check as "Required".


I am collaborating with a team where I want to require additional code reviews or specific status checks before merging

1.Open Branch Protection Rules :GitHub Settings.Go to your repository on GitHub, click Settings > Branches, and edit your rule for develop.Verification: The existing branch protection rule configuration page for develop is displayed.2.Require Pull Request Reviews :Review Count.Check Require a pull request before merging, then check Require approvals. Set the required number of approving reviews (e.g., 1 or 2 depending on your team size).Verification: Input fields appear to specify how many reviewers are needed and options to dismiss stale reviews.3.Require Status Checks :CI Validation.Ensure Require status checks to pass before merging is checked, and verify your CI job (e.g., Run Tests & Report) is selected as a required check.Verification: The specific test job name appears in the list with a checkmark.4.Save Protection Rules :Finalize.Scroll to the bottom and click Save changes.Verification: The rule updates successfully, and any open PR targeting develop will now show both missing review approvals and pending status checks.


