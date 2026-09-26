# delete branch

{% stepper %}
{% step %}
## Create a feature branch from `develop`

Let's say you're working in a **DevOps team** in a company. You've been assigned to implement a **"Jenkins Dashboard Customization"** feature.

```bash
git checkout -b feature/jenkins-dashboard
```
{% endstep %}

{% step %}
## Implement the feature, commit code, and push to remote

```bash
git add .
git commit -m "Added Jenkins dashboard customization feature"
git push origin feature/jenkins-dashboard
```
{% endstep %}

{% step %}
## Raise a Pull Request (PR)

Raise a Pull Request from `feature/jenkins-dashboard` → `develop`.

Code is reviewed and merged successfully.
{% endstep %}
{% endstepper %}

## Why delete the branch?

Now that the feature is:

* **Merged**
* **Tested**
* **Deployed**

There is **no further need** for the branch. Keeping too many feature branches clutters the repository and may confuse team members.

## Git branch delete commands

### Delete a local branch

After the feature is merged:

```bash
git branch -d feature/jenkins-dashboard
```

* `-d` performs a safe delete and will only delete if the branch is already merged.
* Use `-D` to force delete if needed:

```bash
git branch -D feature/jenkins-dashboard
```

{% hint style="warning" %}
Use this only if you are **100% sure** changes are already merged or not needed anymore.
{% endhint %}

### Delete a remote branch

To delete the same branch from remote (GitHub/GitLab/Bitbucket):

```bash
git push origin --delete feature/jenkins-dashboard
```

## Precautions

| Precaution                                             | Explanation                                                           |
| ------------------------------------------------------ | --------------------------------------------------------------------- |
| 💡 Check merge status                                  | Use `git log --graph --oneline --all` to verify merge before deleting |
| 🛑 Don’t delete shared branches like `main`, `develop` | Only delete feature, bugfix, or release branches                      |
| ✅ Use `-d` not `-D` unless forced                      | Prevents accidental data loss                                         |
| 🔍 Review Pull Request                                 | Make sure the PR is merged successfully in GitHub                     |

## Bonus tip for teaching

Show students:

```bash
git branch         # Shows local branches
git branch -r      # Shows remote branches
git branch -a      # All branches (local + remote)
```

Then demonstrate how, after deleting:

```bash
git branch         # Will not show deleted local branch
git branch -r      # Will not show remote branch if deleted from origin
```
