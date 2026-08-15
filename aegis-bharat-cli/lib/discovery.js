'use strict';

const ora = require('ora');
const Table = require('cli-table3');
const chalk = require('chalk');
const { NETWORK_MAP_FILE, writeJson, readJson, randomIp, randomMac, randomInt, nowIso, sleep } = require('./utils');
const { printSectionHeader } = require('./banner');
const theme = require('./theme');

/**
 * Builds a simulated 8-tier network topology mirroring the Aegis-Bharat
 * architecture (origin / edge / scrub / brain / comply / protected /
 * recovery / upstream). Nothing here touches a real interface — it is
 * randomly generated to look plausible for the demo.
 */
function generateNetworkMap(nodeName, cloudProvider = 'AWS') {
  const azCount = randomInt(2, 4);
  const azs = Array.from({ length: azCount }, (_, i) => `ap-south-1${String.fromCharCode(97 + i)}`);

  let cdnName = 'Anycast Edge (CloudFront)';
  let lbType = 'Network Load Balancer (TCP)';
  let computeType = 'EC2 Instances';
  
  if (cloudProvider === 'GCP') {
    cdnName = 'Cloud CDN';
    lbType = 'TCP/UDP Load Balancer';
    computeType = 'Compute Engine VMs';
  } else if (cloudProvider === 'Azure') {
    cdnName = 'Azure Front Door';
    lbType = 'Azure Standard Load Balancer';
    computeType = 'Azure Virtual Machines';
  }

  return {
    generatedAt: nowIso(),
    nodeName,
    cloudProvider,
    interfaces: [
      { name: 'eth0', mac: randomMac(), role: 'ingress (XDP attach point)', speed: '25 Gbps', mtu: 1500 },
      { name: 'eth1', mac: randomMac(), role: 'east-west mesh', speed: '10 Gbps', mtu: 9000 },
    ],
    availabilityZones: azs,
    tiers: {
      edge: {
        cdn: cdnName,
        loadBalancer: { type: lbType, ip: randomIp() },
      },
      scrub: {
        xdpHostIp: randomIp(),
        xdpAttached: false,
      },
      protected: {
        internalSubnet: `10.${randomInt(0, 255)}.0.0/16`,
        appNodes: Array.from({ length: randomInt(12, 45) }, () => ({
          ip: randomIp(),
          az: azs[randomInt(0, azs.length - 1)],
          type: computeType,
        })),
      },
    },
    upstream: {
      isp: 'National Internet Exchange',
      asn: `AS${randomInt(130000, 140000)}`,
      peeringPoint: randomIp(),
    },
  };
}

function printTopologyDiagram(map) {
  console.log('\n' + theme.bold('Discovered Network Topography [VPC Architecture]'));
  
  // Internet & DNS Tier
  console.log(chalk.gray(`      [ ${map.upstream.isp} ]`));
  console.log(chalk.gray('           │'));
  console.log(chalk.gray('           ▼'));
  
  let dnsName = 'Route 53 (DNS)';
  let storageName = 'S3 (Static Assets)';
  let dbName = 'Amazon RDS';
  let cacheName = 'ElastiCache Node';
  let computeLabel = 'EC2 Node';
  
  if (map.cloudProvider === 'GCP') {
    dnsName = 'Cloud DNS';
    storageName = 'Cloud Storage';
    dbName = 'Cloud SQL';
    cacheName = 'Memorystore';
    computeLabel = 'Compute VM';
  } else if (map.cloudProvider === 'Azure') {
    dnsName = 'Azure DNS';
    storageName = 'Blob Storage';
    dbName = 'Azure SQL';
    cacheName = 'Redis Cache';
    computeLabel = 'Azure VM';
  }

  console.log(chalk.yellow(`      [ ${dnsName} ]`) + chalk.gray(' ────┐'));
  console.log(chalk.gray('           │                 │'));
  console.log(chalk.gray('           ▼                 ▼'));
  console.log(chalk.cyan(`      [ ${map.tiers.edge.cdn} ]`) + chalk.gray(`   [ ${storageName} ]`));
  console.log(chalk.gray('           │'));
  console.log(chalk.gray('           ▼'));
  
  // Security / Scrubbing Tier
  const scrubPlane = chalk.bold.magenta(`[ XDP Kernel Scrub Plane ]`) + chalk.yellow(' ⟵ eBPF attach point');
  console.log(`      ${scrubPlane}`);
  console.log(chalk.gray('           │'));
  console.log(chalk.gray('           ▼'));
  
  // Load Balancing Tier
  console.log(chalk.blue(`   [ ${map.tiers.edge.loadBalancer.type} ]`));
  console.log(chalk.gray('           │'));
  
  // VPC & Subnets Tier
  console.log(chalk.magenta('     ┌─────┴────────────────────────────────┐'));
  console.log(chalk.magenta('     │          Virtual Private Cloud       │'));
  console.log(chalk.gray('     │ ┌────────────────┐  ┌──────────────┐ │'));
  console.log(chalk.gray('     │ │ [ AZ: A ]      │  │ [ AZ: B ]    │ │'));
  console.log(chalk.gray(`     │ │   ${chalk.green(`[${computeLabel}]`)}     │  │   ${chalk.green(`[${computeLabel}]`)}   │ │`));
  console.log(chalk.gray('     │ │    │      │    │  │    │      │  │ │'));
  console.log(chalk.gray(`     │ │ ${chalk.magenta(`[${dbName}]`)} ${chalk.cyan(`[Cache]`)}│  │ ${chalk.magenta(`[${dbName}]`)} ${chalk.cyan(`[Cache]`)}│ │`));
  console.log(chalk.gray('     │ └────────────────┘  └──────────────┘ │'));
  console.log(chalk.magenta('     └──────────────────────────────────────┘'));
  console.log(chalk.dim(`  (${map.tiers.protected.appNodes.length} active instances across ${map.availabilityZones.length} Availability Zones)\n`));
}

async function discoverNetwork(nodeName, cloudProvider = 'AWS') {
  printSectionHeader(`Network Discovery [${cloudProvider} Integration]`, theme.scrub);
  
  const authSpinner = ora(`Authenticating with ${cloudProvider} APIs...`).start();
  await sleep(800);
  authSpinner.succeed(`Authenticated via IAM Role (arn:${cloudProvider.toLowerCase()}:iam::123456789012:role/AegisOperator)`);
  
  console.log(theme.muted(`\n[System] Initializing infrastructure-as-code state parser...`));
  await sleep(500);
  console.log(chalk.cyan(`> terraform init -backend-config="bucket=aegis-tf-state-${cloudProvider.toLowerCase()}"`));
  await sleep(1200);
  console.log(chalk.green(`✔ Terraform backend initialized successfully.`));
  console.log(chalk.cyan(`> terraform state pull`));
  await sleep(1500);
  console.log(chalk.gray(`  Downloaded 4.2MB of remote state data.`));

  console.log(theme.muted(`\n[System] Querying live asset inventory...`));
  if (cloudProvider === 'AWS') {
    console.log(chalk.cyan(`> aws ec2 describe-vpcs --region ap-south-1`));
    await sleep(700);
    console.log(chalk.cyan(`> aws elbv2 describe-load-balancers`));
    await sleep(900);
    console.log(chalk.cyan(`> aws ec2 describe-instances --filters "Name=instance-state-name,Values=running"`));
  } else if (cloudProvider === 'GCP') {
    console.log(chalk.cyan(`> gcloud compute networks list --format="json"`));
    await sleep(700);
    console.log(chalk.cyan(`> gcloud compute forwarding-rules list`));
    await sleep(900);
    console.log(chalk.cyan(`> gcloud compute instances list --filter="status=RUNNING"`));
  } else if (cloudProvider === 'Azure') {
    console.log(chalk.cyan(`> az network vnet list -o json`));
    await sleep(700);
    console.log(chalk.cyan(`> az network lb list`));
    await sleep(900);
    console.log(chalk.cyan(`> az vm list -d --query "[?powerState=='VM running']"`));
  }
  await sleep(1200);
  
  const map = generateNetworkMap(nodeName, cloudProvider);
  const appNodeCount = map.tiers.protected.appNodes.length;

  console.log(chalk.green(`✔ Discovery complete. Found 3 VPCs, 2 Load Balancers, ${appNodeCount} Running Instances.`));
  console.log();

  const spinner = ora('Mapping topology to Aegis-Bharat XDP plane...').start();
  await sleep(1000);
  writeJson(NETWORK_MAP_FILE, map);
  spinner.succeed('Network topology mapped and secured in local cache.');

  printTopologyDiagram(map);

  const table = new Table({ head: [chalk.gray('Tier'), chalk.gray('Detail')], colWidths: [16, 56] });
  table.push(
    ['Interfaces', map.interfaces.map((i) => `${i.name} (${i.role})`).join('\n')],
    ['AZs', map.availabilityZones.join(', ')],
    ['Edge LB', `${map.tiers.edge.loadBalancer.ip} — ${map.tiers.edge.loadBalancer.type}`],
    ['XDP host', `${map.tiers.scrub.xdpHostIp} (not yet attached)`],
    ['App nodes', `${map.tiers.protected.appNodes.length} nodes in ${map.tiers.protected.internalSubnet}`],
    ['Upstream', `${map.upstream.isp} · ${map.upstream.asn}`]
  );
  console.log(table.toString());
  console.log(theme.muted(`Saved to .aegis/network-map.json\n`));
  return map;
}

function loadNetworkMap() {
  return readJson(NETWORK_MAP_FILE);
}

module.exports = { discoverNetwork, loadNetworkMap, generateNetworkMap };
