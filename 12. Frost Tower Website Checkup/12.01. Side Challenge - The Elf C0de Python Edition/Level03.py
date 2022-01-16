import elf, munchkins, levers, lollipops, yeeters, pits
lever = levers.get(0)
elf.moveTo(lever.position)
lever.pull(lever.data()+2)
elf.moveTo(lollipops.get(0).position)
elf.moveUp(100)
