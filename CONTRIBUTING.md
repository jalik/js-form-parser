# Contributing

Every contribution of any type and size is greatly appreciated, so thank you.  
Please follow the steps below depending on your case.

## Opening an issue

If you find a bug, even a seemingly minor one, please feel free to open an issue.

## Submitting a Pull Request

1. Fork the repository with `git clone [repository_url]`
2. Create a new local branch with `git checkout -b [branch]`
   * if your PR is meant to **fix something**, name your branch by prefixing it with `fix/`, for example `fix/broken-feature`
   * if your PR is meant to **add a new feature**, name your branch by prefixing it with `feature/`, for example `feature/hello`
3. Work on your branch (commit normally until it's ready)
4. Add or modify tests in the `test` folder to facilitate code review and PR validation
5. Make sure all tests pass when running `npm run test`
6. Make sure there are no lint errors (related to your code) when running `npm run lint`
7. Squash all commits into a single commit that resumes the fix or the feature
8. Push your branch with `git push origin [branch]`
9. Submit the **Pull Request**

Note that the validation process may take some time depending on the impact and size of your modifications.  
Once validated and merged, a new version of the package will be published with you modifications.
