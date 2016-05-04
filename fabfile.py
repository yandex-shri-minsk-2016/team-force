import os
import json
from datetime import datetime
from fabric.api import *
from fabric.context_managers import settings
from fabric.utils import fastprint


with open('deploy.json', 'r') as f:
    env.project_settings = json.loads(f.read())


@task
def deploy():
    if os.environ.get('TRAVIS_BRANCH', 'None varible branch') == 'master':
        env.settings = env.project_settings['stages']['stable']
    else:
        env.settings = env.project_settings['stages']['development']

    # Set env.
    env.host_string = env.settings['host']
    env.user = env.settings['user']
    env.password = os.environ.get('sshpass', '')

    with hide('stderr', 'stdout', 'warnings', 'running'):
        with cd(env.settings['code_src_directory']):
            pull_repository()
            install_requirements()
        restart_application()


def print_status(description):
    def print_status_decorator(fn):
        def print_status_wrapper():
            now = datetime.now().strftime('%H:%M:%S')
            fastprint('({time}) {description}{suffix}'.format(
                time=now,
                description=description.capitalize(),
                suffix='...\n')
            )
            fn()
            now = datetime.now().strftime('%H:%M:%S')
            fastprint('({time}) {description}{suffix}'.format(
                time=now,
                description='...finished '+description,
                suffix='.\n')
            )
        return print_status_wrapper
    return print_status_decorator


@print_status('pulling git repository')
def pull_repository():
    command = 'git pull {} {}'.format(
        env.project_settings.get('git_repository'),
        env.settings.get('vcs_branch')
    )
    print command
    run(command)


@print_status('installing requirements')
def install_requirements():
    run('npm i')


@print_status('restarting application')
def restart_application():
    with settings(warn_only=True):
        restart_command = env.settings['restart_command']
        result = run(restart_command)
    if result.failed:
        abort('Could not restart application.')
