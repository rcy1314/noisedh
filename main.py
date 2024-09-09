import yaml
import os
import time
import http.client
from urllib.parse import urlparse
from datetime import datetime

# 定义跳过检测 URL 部分列表
EXCLUDED_URL_PARTS = [
    # 省略其他部分以节省空间
]

def should_exclude_url(url):
    for part in EXCLUDED_URL_PARTS:
        if part in url:
            print(f"URL {url} 包含待检测部分 '{part}'，标记为有效。")
            return True
    return False

def check_url(url, retries=3, timeout=10):
    if should_exclude_url(url):
        return True, url  # 直接标记为有效

    parsed_url = urlparse(url)
    host = parsed_url.netloc
    path = parsed_url.path if parsed_url.path else "/"

    for attempt in range(retries):
        try:
            conn = http.client.HTTPConnection(host, timeout=timeout)
            conn.request("HEAD", path)
            response = conn.getresponse()
            conn.close()

            if response.status == 200:
                return True, url  # 返回有效链接
            elif response.status == 404:
                print(f"链接未找到 (404)，URL: {url}，标记为删除。")
                return False, None  # 标记为删除
            else:
                print(f"收到状态码 {response.status}，URL: {url}，继续保留。")
                return True, url  # 只保留有效链接，不移除

        except Exception as e:
            print(f"请求 URL {url} 发生错误: {e}，正在重试...")
            time.sleep(2)  # 等待后重试

    print(f"经过 {retries} 次尝试验证 URL 失败: {url}")
    return None, url  # 在重试失败后标记为需要人工审核

def write_yaml(yaml_file, data):
    with open(yaml_file, 'w', encoding='utf-8') as file:
        file.write('---\n')
        yaml.safe_dump(data, file, allow_unicode=True, sort_keys=False)

def clean_invalid_urls(yaml_file, report_file):
    auto_modified_links_report = []
    review_links_report = []
    invalid_links_report = []

    try:
        with open(yaml_file, 'r', encoding='utf-8') as file:
            content = file.read()

        if not content.startswith('---'):
            print("YAML 文件必须以 '---' 开头。")
            return

        content = content.replace('\t', '    ')
        data = yaml.safe_load(content)

    except yaml.YAMLError as e:
        print(f"解析 YAML 文件时出错: {e}")
        return

    if not isinstance(data, list):
        print("YAML 文件不包含条目列表。")
        return

    for category in data:
        if 'links' in category:
            valid_links = []
            links_to_remove = []
            for link in category['links']:
                url = link.get('url')
                if url:
                    result, new_url = check_url(url)
                    if result is True:
                        valid_links.append(link)
                    elif result is False:
                        print(f"移除无效链接条目: {link}")
                        invalid_links_report.append(link)
                        links_to_remove.append(link)
                    elif new_url:  # 如果有新的可访问地址
                        print(f"自动重定向，旧 URL: {url} -> 新 URL: {new_url}")
                        link['url'] = new_url
                        auto_modified_links_report.append(link)
                        valid_links.append(link)
                    else:
                        print(f"链接需人工审核，URL: {url}，标记为有效。")
                        review_links_report.append(link)
                        valid_links.append(link)
                else:
                    valid_links.append(link)

            for link in links_to_remove:
                category['links'].remove(link)

            category['links'] = valid_links
            write_yaml(yaml_file, data)

        elif 'list' in category:
            for item in category['list']:
                if 'links' in item:
                    valid_links = []
                    links_to_remove = []
                    for link in item['links']:
                        url = link.get('url')
                        if url:
                            result, new_url = check_url(url)
                            if result is True:
                                valid_links.append(link)
                            elif result is False:
                                print(f"移除无效链接条目: {link}")
                                invalid_links_report.append(link)
                                links_to_remove.append(link)
                            elif new_url:
                                print(f"自动重定向，旧 URL: {url} -> 新 URL: {new_url}")
                                link['url'] = new_url
                                auto_modified_links_report.append(link)
                                valid_links.append(link)
                            else:
                                print(f"链接需人工审核，URL: {url}，标记为有效。")
                                review_links_report.append(link)
                                valid_links.append(link)
                        else:
                            valid_links.append(link)

                    for link in links_to_remove:
                        item['links'].remove(link)

                    item['links'] = valid_links
                    write_yaml(yaml_file, data)

    write_yaml(yaml_file, data)

    report_dir = os.path.dirname(report_file)
    os.makedirs(report_dir, exist_ok=True)

    current_date = datetime.now().strftime("%Y年%m月%d日 %H:%M")
    new_report_content = f"## 检查日期: {current_date}\n\n"

    if auto_modified_links_report:
        new_report_content += "# 自动修改的重定向网站\n\n"
        for link in auto_modified_links_report:
            new_report_content += f"- 标题: {link.get('title', '未知')}\n"
            new_report_content += f"  原始 URL: {link.get('url', '无 URL')}\n"
            new_report_content += f"  描述: {link.get('description', '无描述')}\n\n"

    if review_links_report:
        new_report_content += "# 需人工检查的链接\n\n"
        for link in review_links_report:
            new_report_content += f"- 标题: {link.get('title', '未知')}\n"
            new_report_content += f"  URL: {link.get('url', '无 URL')}\n"
            new_report_content += f"  描述: {link.get('description', '无描述')}\n\n"

    if invalid_links_report:
        new_report_content += "# 已失效链接\n\n"
        new_report_content += "### 此项会自动删除链接\n\n"
        for link in invalid_links_report:
            new_report_content += f"- 标题: {link.get('title', '未知')}\n"
            new_report_content += f"  URL: {link.get('url', '无 URL')}\n"
            new_report_content += f"  描述: {link.get('description', '无描述')}\n\n"

    if not auto_modified_links_report and not invalid_links_report and not review_links_report:
        new_report_content += "# 当前所有链接均有效\n"

    with open(report_file, 'a', encoding='utf-8') as report:
        report.write(new_report_content)

def main(yaml_file_path, report_file_name):
    print("开始 URL 验证过程...")
    clean_invalid_urls(yaml_file_path, report_file_name)
    print("URL 验证过程完成。")

if __name__ == "__main__":
    yaml_file_path = './data/webstack.yml'
    report_file_name = './content/invalidlinks.md'
    main(yaml_file_path, report_file_name)
