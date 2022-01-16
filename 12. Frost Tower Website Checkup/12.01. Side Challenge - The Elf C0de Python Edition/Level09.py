import elf, munchkins, levers, lollipops, yeeters, pits
def func_to_pass_to_mucnhkin(list_of_lists):
    s = 0
    for l in list_of_lists:
        for e in l:
            if isinstance(e, int):
                s = s + int(e)
    return s
munchkins.get(0).answer(func_to_pass_to_mucnhkin)
all_levers = levers.get()
moves = [elf.moveDown, elf.moveLeft, elf.moveUp, elf.moveRight] * 2
for i, move in enumerate(moves):
    move(i+1)
    if (i < len(all_levers)):
        all_levers[i].pull(i)
elf.moveUp(2)
elf.moveLeft(4)
elf.moveUp(100)